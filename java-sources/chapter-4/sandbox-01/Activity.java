import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflow;
import com.amazonaws.services.simpleworkflow.AmazonSimpleWorkflowClientBuilder;
import com.amazonaws.services.simpleworkflow.model.*;

public class Activity{
    //simpleWorkflow


    private static ProfileCredentialsProvider credentials = new ProfileCredentialsProvider("default_admin");
    private static final AmazonSimpleWorkflow simpleWorkflow
            = AmazonSimpleWorkflowClientBuilder.standard().withCredentials(credentials).build() ;

    private static String greetings(String input) throws Throwable {
        return "Hi, " + input + "!";
    }

    public static void main(String[] args) {
        try {
            credentials.getCredentials();
        } catch (Exception e) {
            throw new AmazonClientException("Unable to load Credentials.", e);
        }

        AmazonSimpleWorkflow swf =
                AmazonSimpleWorkflowClientBuilder.standard()
                        .withCredentials(credentials)
                        .withRegion(Regions.US_WEST_2)
                        .build();

        while (true) {
            System.out.println("Polling for an activity task from the tasklist '"
                    + Types.TASKLIST + "' in the domain '" +
                    Types.DOMAIN + "'.");

            ActivityTask task = swf.pollForActivityTask(
                    new PollForActivityTaskRequest()
                            .withDomain(Types.DOMAIN)
                            .withTaskList(new TaskList().withName(Types.TASKLIST)));

            String task_token = task.getTaskToken();

            if (task_token != null) {
                String result = null;
                Throwable error = null;

                try {
                    System.out.println("Executing the activity task. Input is '" +
                            task.getInput() + "'.");
                    result = greetings(task.getInput());
                } catch (Throwable th) {
                    error = th;
                }

                if (error == null) {
                    System.out.println("The activity task success. Result is '"
                            + result + "'.");
                    swf.respondActivityTaskCompleted(
                            new RespondActivityTaskCompletedRequest()
                                    .withTaskToken(task_token)
                                    .withResult(result));
                } else {
                    System.out.println("The activity task failed. Error is '"
                            + error.getClass().getSimpleName() + "'.");
                    swf.respondActivityTaskFailed(
                            new RespondActivityTaskFailedRequest()
                                    .withTaskToken(task_token)
                                    .withReason(error.getClass().getSimpleName())
                                    .withDetails(error.getMessage()));
                }
            }
        }
    }
}