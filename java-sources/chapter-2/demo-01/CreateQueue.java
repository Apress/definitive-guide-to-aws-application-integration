import com.amazonaws.auth.profile.ProfileCredentialsProvider;
import com.amazonaws.services.sqs.AmazonSQS;
import com.amazonaws.services.sqs.AmazonSQSClientBuilder;
import com.amazonaws.services.sqs.model.CreateQueueRequest;
import com.amazonaws.services.sqs.model.CreateQueueResult;

import java.util.HashMap;
import java.util.Map;

public class CreateQueue {
    public static void main(String... args) {
        ProfileCredentialsProvider profileCredentialsProvider = new ProfileCredentialsProvider("sqs_dev");
        AmazonSQS sqs = AmazonSQSClientBuilder.standard().withCredentials(profileCredentialsProvider).build();
        Map<String, String> attributes = new HashMap<> ();
        attributes.put("DelaySeconds", "5");
        CreateQueueRequest request = new CreateQueueRequest().withQueueName("programmatic-queue-4")
                .withAttributes(attributes);
        CreateQueueResult result = sqs.createQueue(request);
        System.out.println(result.getQueueUrl());

    }
}